#!/bin/bash

cat src/prisma/*.prisma > prisma/schema.prisma
cat src/*/entities/*.prisma >> prisma/schema.prisma

echo "Merged schemas into: prisma/schema.prisma"
