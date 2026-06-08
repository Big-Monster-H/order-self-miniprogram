-- ==========================================
--  init.sql — 数据库初始化
--  首次启动 Docker 时自动执行
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(64) UNIQUE,
  phone VARCHAR(20),
  nickname VARCHAR(50),
  avatar VARCHAR(255),
  real_name VARCHAR(20),
  id_card VARCHAR(18),
  role VARCHAR(20) DEFAULT 'user',
  deposit_paid TINYINT(1) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入默认管理员 (密码: admin123)
INSERT INTO users (phone, nickname, role, status) VALUES
('admin', '系统管理员', 'admin', 'active');