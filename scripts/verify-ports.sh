#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ Verificating Port Configuration - Chaldea Foundation Monorepo  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

apps=(
    "apps/private-cloud-frontend:3000"
    "apps/mages-profile:3010"
)

echo "Found fundamental structure"
echo ""

for app_port in "${apps[@]}"; do
    app_path="${app_port%:*}"
    port="${app_port##*:}"

    echo "Localized material components: $app_path"
    echo "     Altering basic structure: $port"

    if lsof -i ":$port" &> /dev/null; then
        echo "      Reforcing material: Success"
    else
        echo "      Reforcing material: Fail"
    fi

    if [ -f "$app_path/package.json" ]; then
        dev_script=$(grep -o '"dev"[[:space:]]*:[[:space:]]*"[^"]*"' "$app_path/package.json" | cut -d'"' -f4)
        echo "      Enhanced material properties: $dev_script"
    fi
    echo ""
done

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                      Projection Magic                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

for app_port in "${apps[@]}"; do
    port="${app_port##*:}"
    echo "Blade on $port:"

    if lsof -i ":$port" &> /dev/null; then
        lsof -i ":$port" | tail -1
    else
        echo "   (No active threads)"
    fi
    echo ""
done

echo "Unlimited Blade Works!"
