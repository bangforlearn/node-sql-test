# 使用官方 PostgreSQL 映像檔作為基礎映像
FROM postgres:latest

# 設置環境變量，以便在容器啟動時執行自定義腳本
ENV POSTGRES_DB=bang_db
ENV POSTGRES_USER=bang
ENV POSTGRES_PASSWORD=abcd1234

# 將你的 SQL 檔案複製到 Docker 映像檔中的特定目錄
# COPY ./init.sql /docker-entrypoint-initdb.d/

# 容器啟動時會自動執行 /docker-entrypoint-initdb.d/ 目錄下的所有 .sql 檔案
