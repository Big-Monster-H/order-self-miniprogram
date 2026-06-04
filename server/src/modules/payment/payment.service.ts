import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { Transaction, TransactionType, TransactionStatus } from './transaction.entity';
import { Order, OrderStatus } from '../order/order.entity';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @Inject('APP_CONFIG') private config: any,
  ) {}

  /** 微信小程序支付 - 统一下单 */
  async wxPayOrder(userId: number, orderId: number, openid: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new BadRequestException('订单不存在');
    if (order.status !== OrderStatus.PENDING) throw new BadRequestException('订单状态不可支付');

    const wxConfig = this.config.wx;
    const params = {
      appid: wxConfig.appId,
      mch_id: wxConfig.mchId,
      nonce_str: this.randomStr(32),
      body: `订单-${order.order_no}`,
      out_trade_no: order.order_no,
      total_fee: order.total_amount, // 分
      spbill_create_ip: '127.0.0.1',
      notify_url: wxConfig.notifyUrl,
      trade_type: 'JSAPI',
      openid: openid,
    };

    const sign = this.wxSign(params, wxConfig.payKey);
    params['sign'] = sign;

    try {
      const xmlBody = this.toXml(params);
      const { data } = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', xmlBody, {
        headers: { 'Content-Type': 'text/xml' },
      });
      const result = this.parseXml(data);

      if (result.return_code !== 'SUCCESS' || result.result_code !== 'SUCCESS') {
        throw new BadRequestException(result.err_code_des || '支付请求失败');
      }

      // 生成小程序支付参数
      const payParams = {
        appId: wxConfig.appId,
        timeStamp: String(Math.floor(Date.now() / 1000)),
        nonceStr: this.randomStr(32),
        package: `prepay_id=${result.prepay_id}`,
        signType: 'MD5',
      };
      payParams['paySign'] = this.wxSign(payParams, wxConfig.payKey);

      // 创建交易记录
      const tx = this.txRepo.create({
        transaction_no: this.generateTxNo(),
        user_id: userId,
        order_id: order.id,
        type: TransactionType.PAY,
        amount: order.total_amount,
        status: TransactionStatus.PENDING,
        pay_method: 'wechat',
      });
      await this.txRepo.save(tx);

      return { payParams, transaction_no: tx.transaction_no };
    } catch (err) {
      throw new BadRequestException('支付请求失败: ' + err.message);
    }
  }

  /** 微信支付回调处理 */
  async wxPayCallback(xmlData: string) {
    const result = this.parseXml(xmlData);
    const wxConfig = this.config.wx;

    // 验签
    const sign = result.sign;
    delete result.sign;
    const calcSign = this.wxSign(result, wxConfig.payKey);
    if (sign !== calcSign) {
      return this.toXml({ return_code: 'FAIL', return_msg: '签名验证失败' });
    }

    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      const orderNo = result.out_trade_no;
      const order = await this.orderRepo.findOne({ where: { order_no: orderNo } });
      if (!order) return this.toXml({ return_code: 'FAIL', return_msg: '订单不存在' });

      // 幂等：已支付则直接返回成功
      if (order.status === OrderStatus.PAID) {
        return this.toXml({ return_code: 'SUCCESS', return_msg: 'OK' });
      }

      // 金额校验：回调金额必须与订单金额一致
      const notifyFee = parseInt(result.total_fee) || 0;
      if (notifyFee !== order.total_amount) {
        return this.toXml({ return_code: 'FAIL', return_msg: '金额不匹配' });
      }

      order.status = OrderStatus.PAID;
      order.paid_at = new Date();
      order.wx_transaction_id = result.transaction_id;
      await this.orderRepo.save(order);

      // 更新交易记录
      await this.txRepo.update(
        { transaction_no: orderNo },
        {
          status: TransactionStatus.SUCCESS,
          third_party_no: result.transaction_id,
          raw_data: result,
        },
      );

      // TODO: 发送微信模板消息通知
    }

    return this.toXml({ return_code: 'SUCCESS', return_msg: 'OK' });
  }

  /** 创建保证金支付 */
  async payDeposit(userId: number) {
    const tx = this.txRepo.create({
      transaction_no: this.generateTxNo(),
      user_id: userId,
      type: TransactionType.DEPOSIT,
      amount: this.config.deposit.amount,
      status: TransactionStatus.PENDING,
    });
    await this.txRepo.save(tx);
    return tx;
  }

  /** 微信签名 */
  private wxSign(params: any, key: string): string {
    const sorted = Object.keys(params)
      .filter((k) => k !== 'sign' && params[k] !== '' && params[k] !== undefined && params[k] !== null)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    return crypto.createHash('md5').update(`${sorted}&key=${key}`).digest('hex').toUpperCase();
  }

  private randomStr(len: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < len; i++) str += chars[Math.floor(Math.random() * chars.length)];
    return str;
  }

  private toXml(obj: any): string {
    let xml = '<xml>';
    for (const key in obj) xml += `<${key}><![CDATA[${obj[key]}]]></${key}>`;
    xml += '</xml>';
    return xml;
  }

  private parseXml(xml: string): any {
    const result: any = {};
    const regex = /<(\w+)><!\[CDATA\[(.*?)\]\]><\/\1>/g;
    let match: any;
    while ((match = regex.exec(xml)) !== null) result[match[1]] = match[2];
    return result;
  }

  private generateTxNo(): string {
    return 'TX' + Date.now() + uuid().replace(/-/g, '').slice(0, 8).toUpperCase();
  }
}