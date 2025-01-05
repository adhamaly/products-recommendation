##############
# Build Stage
##############

FROM node:18-bullseye-slim AS build

# Set working directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY --chown=node:node ./package*.json .

# Copy Prisma Migrations
COPY --chown=node:node ./src/prisma .

# Install node modules using Yarn (equivalent to npm ci)
RUN yarn install --frozen-lockfile

# Copy the rest of the repository files and folders
COPY --chown=node:node . .

# Generate prisma files >> Build project >> Reinstall node_modules but without dev modules
RUN yarn prisma:generate && yarn build && yarn install --production

# List the contents of the dist folder to ensure the build output exists
RUN ls -alh /usr/src/app/dist

# Use the node user from the image (instead of the root user)
USER node

###################
# Production Stage
###################

FROM node:18-bullseye-slim AS production

# Create app directory
WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
# Prisma folder is needed to apply migrations and seeds
COPY --chown=node:node --from=build /usr/src/app/src/prisma .
# Package.json is needed for the startup command "yarn docker:entrypoint"
COPY --chown=node:node --from=build /usr/src/app/package*.json .
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .

# List contents of the dist folder to verify build output in production stage
RUN ls -alh /usr/src/app/dist

# Bind port 3000
EXPOSE 3000

# Command to run when the container starts
CMD [ "yarn", "docker:entrypoint" ]
