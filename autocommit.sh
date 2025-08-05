#!/bin/bash

# Função para exibir spinner enquanto o processo roda
show_spinner() {
  local pid=$1
  local delay=0.1
  local spinstr='|/-\'
  tput civis  # Esconde o cursor
  while ps -p $pid &>/dev/null; do
    local temp=${spinstr#?}
    printf "⏳ Gerando mensagem de commit... [%c]  " "$spinstr"
    local spinstr=$temp${spinstr%"$temp"}
    sleep $delay
    printf "\r"
  done
  tput cnorm  # Mostra o cursor de novo
}

# Exibe uma mensagem enquanto o Gemini processa
echo "🔄 Enviando diff para o Gemini..."

# Executa o Gemini em segundo plano e salva a saída em um arquivo temporário
temp_output=$(mktemp)
(git diff | gemini -p 'Write a commit message for this diff following conventional commits') > "$temp_output" &
gemini_pid=$!

# Mostra spinner enquanto espera
show_spinner $gemini_pid

# Lê a saída gerada
raw_output=$(<"$temp_output")
rm "$temp_output"

# Verifica se a saída é válida
if [ -z "$raw_output" ]; then
    echo "❌ Erro: não foi possível gerar a mensagem de commit com o Gemini."
    exit 1
fi

# [Opcional] Modo verbose para debug
[ "$VERBOSE" == "1" ] && echo -e "\n📋 Saída bruta do Gemini:\n$raw_output"

# Tenta extrair a mensagem de dentro de um bloco de código (```).
commit_message=$(echo "$raw_output" | sed -n '/```/,/```/p' | sed '1d;$d')

# Se não encontrou bloco de código, usa a saída bruta
if [ -z "$commit_message" ]; then
    commit_message="$raw_output"
fi

# Modo dry-run: apenas exibe a mensagem e sai
if [ "$1" == "--dry-run" ]; then
    echo -e "\n📝 Mensagem gerada (modo dry-run):\n"
    echo "$commit_message"
    exit 0
fi

# Cria arquivo temporário com a mensagem
temp_file=$(mktemp)
echo "$commit_message" > "$temp_file"

# Mostra a mensagem e pede confirmação
echo -e "\n📝 Mensagem de commit gerada:\n"
echo "$commit_message"
echo
read -p "Deseja prosseguir com o commit? (S/n) " confirm
confirm=${confirm:-s}

if [[ "$confirm" != [sS] ]]; then
    echo "❌ Commit cancelado."
    rm "$temp_file"
    exit 0
fi

# Adiciona os arquivos modificados e novos após confirmação
# Inclui arquivos não rastreados
# shellcheck disable=SC2038
git add .

# Realiza o commit
git commit -F "$temp_file"

# Limpa o arquivo temporário
rm "$temp_file"

echo "✅ Commit realizado com sucesso!"
