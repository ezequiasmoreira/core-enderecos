NOW="$(date +'%B %d, %Y')"
RED="\033[1;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
PURPLE="\033[1;35m"
CYAN="\033[1;36m"
WHITE="\033[1;37m"
RESET="\033[0m"

LATEST_HASH=`git log --pretty=format:'%h' -n 1`

QUESTION_FLAG="${GREEN}?"
WARNING_FLAG="${YELLOW}!"
NOTICE_FLAG="${CYAN}❯"

ADJUSTMENTS_MSG="${QUESTION_FLAG} ${CYAN}Agora sera feito ajustes em ${WHITE}CHANGELOG.md${CYAN}. Pressione enter para continuar."
PUSHING_MSG="${NOTICE_FLAG} Publicando nova versao para ${WHITE}origin${CYAN}..."

function bump {
	version=$INPUT_STRING
	if [ "$1" = $(find ./ -iname sonar*.properties -type f) ]; then
	    search='^sonar.projectVersion=.*$'
	    replace="sonar.projectVersion=${version}"
	else
	    search='("version":[[:space:]]*").+(")'
	    replace="\1${version}\2"
	fi
	sed -i -E "s/${search}/${replace}/g" $1
}

if [ -f VERSION ]; then
    BASE_STRING=`cat VERSION`
    BASE_LIST=(`echo $BASE_STRING | tr '.' ' '`)
    V_MAJOR=${BASE_LIST[0]}
    V_MINOR=${BASE_LIST[1]}
    V_PATCH=${BASE_LIST[2]}
    echo -e "${NOTICE_FLAG} Versao atual: ${WHITE}$BASE_STRING"
    echo -e "${NOTICE_FLAG} Último hash de commit: ${WHITE}$LATEST_HASH"
    V_MINOR=$((V_MINOR + 1))
    V_PATCH=0
    SUGGESTED_VERSION="$V_MAJOR.$V_MINOR.$V_PATCH"
    echo -ne "${QUESTION_FLAG} ${CYAN}Informe o numero da versao [${WHITE}$SUGGESTED_VERSION${CYAN}]: "
    read INPUT_STRING
    if [ "$INPUT_STRING" = "" ]; then
        INPUT_STRING=$SUGGESTED_VERSION
    fi
    echo -e "${NOTICE_FLAG} Será setado uma nova versao para ${WHITE}$INPUT_STRING"
    echo $INPUT_STRING > VERSION
    bump "package.json"
    bump "bower.json"
    bump $(find ./ -iname sonar*.properties -type f)
    echo "## $INPUT_STRING ($NOW)" > tmpfile
    git log --pretty=format:"  - %s" "$BASE_STRING"...HEAD >> tmpfile
    echo "" >> tmpfile
    echo "" >> tmpfile
    cat CHANGELOG.md >> tmpfile
    mv tmpfile CHANGELOG.md
    echo -e "$ADJUSTMENTS_MSG"
    read
    echo -e "$PUSHING_MSG"
    git add .
    git commit -m "Bump de versao para ${INPUT_STRING}."
    git tag -a -m "Versao da tag ${INPUT_STRING}." "$INPUT_STRING"
    git push origin master --tags
else
    echo -e "${WARNING_FLAG} Nao foi possivel encontrar o arquivo VERSION."
    echo -ne "${QUESTION_FLAG} ${CYAN}Você quer criar um arquivo de versão e começar do zero? [${WHITE}y${CYAN}]: "
    read RESPONSE
    if [ "$RESPONSE" = "" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "Y" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "Yes" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "yes" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "YES" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "y" ]; then
        echo "0.1.0" > VERSION
        echo "## 0.1.0 ($NOW)" > CHANGELOG.md
        git log --pretty=format:"  - %s" >> CHANGELOG.md
        echo "" >> CHANGELOG.md
        echo "" >> CHANGELOG.md
        echo -e "$ADJUSTMENTS_MSG"
        read
        echo -e "$PUSHING_MSG"
        #git add VERSION CHANGELOG.md
        git add .
        git commit -m "Adicionado os arquivos VERSION e CHANGELOG.md, Bump da versao para 0.1.0."
        git tag -a -m "Versao da tag 0.1.0." "0.1.0"
        git push origin master --tags
    fi
fi

echo -e "${NOTICE_FLAG} Finalizado."