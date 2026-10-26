# Grandmasterchess document converter (Word/PowerPoint to PDF via LibreOffice).
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
      libreoffice-writer libreoffice-impress \
      fonts-liberation fonts-dejavu-core fonts-noto-core \
      fonts-crosextra-carlito fonts-crosextra-caladea \
    && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --shell /usr/sbin/nologin converter
WORKDIR /app
COPY server.mjs ./
USER converter
ENV PORT=8080 HOME=/home/converter
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:'+process.env.PORT+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
