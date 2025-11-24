# ============================
# Etapa 1: Build de Angular
# ============================
FROM node:20-alpine AS build

# Crear carpeta de trabajo
WORKDIR /app

# Copiar sólo los archivos de dependencias primero (mejor cache)
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Si tienes package-lock.json, usa npm ci (más determinista)
# Si NO tienes package-lock.json, cambia a: RUN npm install
RUN npm install

# Copiar el resto del código (src, public, etc.)
COPY . .

# Build de la app Angular (Angular 20)
# Asumo que en package.json tienes "build": "ng build"
RUN npm run build

# ============================
# Etapa 2: Servir con Nginx
# ============================
FROM nginx:1.27-alpine AS runtime

# Directorio donde Nginx sirve los archivos
WORKDIR /usr/share/nginx/html

# Limpia el contenido por defecto de Nginx
RUN rm -rf ./*

# En Angular 20 con el builder nuevo, el output por defecto es:
#   dist/<nombre-proyecto>/browser
# Como no sabemos el nombre exacto del proyecto, usamos un comodín:
COPY --from=build /app/dist/*/browser/ ./

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx expone el puerto 80 dentro del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
