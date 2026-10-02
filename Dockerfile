FROM node:20-slim
WORKDIR /app
COPY mcp-server/package.json ./package.json
RUN npm install --omit=dev
COPY mcp-server/ ./
ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787
CMD ["npm","start"]
