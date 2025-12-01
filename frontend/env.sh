#https://stackoverflow.com/questions/70617812/change-environmet-variables-at-runtime-react-vite-with-docker-and-nginx
#!/bin/sh
for i in $(env | grep MY_APP_)
do
    key=$(echo "$i" | cut -d '=' -f 1)
    value=$(echo "$i" | cut -d '=' -f 2-)
    echo "$key=$value"

    # Escape & and / in the value for sed
    escaped_value=$(printf '%s\n' "$value" | sed -e 's/[&/\]/\\&/g')

    # sed JS and CSS only
    find /usr/src/app/dist -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|$key|$escaped_value|g" {} \;
done