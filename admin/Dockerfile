# ==========================================
#  admin/Dockerfile — 管理后台 Nginx 镜像
# ==========================================
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx-admin.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]