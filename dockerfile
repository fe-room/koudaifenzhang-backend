# 使用 Node.js 官方镜像作为基础镜像
FROM node:18-alpine AS base

# 定义构建参数
ARG PROJECT_DIR=/nest-backend


ENV APP_PORT=3000 \
    PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"
    ENV TZ=Asia/Shanghai

# 启用 corepack 和安装 pnpm
RUN corepack enable \
    && yarn global add pm2

WORKDIR $PROJECT_DIR

# 构建阶段
FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


# 生产依赖安装阶段
FROM base AS prod-deps
COPY package.json .
COPY pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile 

FROM base
COPY package.json .
COPY ecosystem.config.js .
COPY .env.development .
COPY .env.production .
COPY --from=prod-deps $PROJECT_DIR/node_modules $PROJECT_DIR/node_modules
COPY --from=build $PROJECT_DIR/dist $PROJECT_DIR/dist

# 暴露应用运行的端口（根据你的配置调整端口号）
EXPOSE $APP_PORT

# 启动应用
CMD ["pnpm", "prod"]