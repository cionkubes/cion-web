function get_version {
    jq '.version' --raw-output < package.json
}

function prehook {
    git fetch
    [[ $(git rev-parse --abbrev-ref --symbolic-full-name @{u}) == "origin/develop" ]] || err "Branch does not track origin/develop"
    [[ $(git rev-parse HEAD) == $(git rev-parse @{u}) ]] || err "Branch is not up to date"
    git diff-files --quiet || err "Unstaged changes"
    git diff-index --quiet --cached HEAD -- || err "Changes not commited"
}

function write_version {
    tmp=$(mktemp)
    cat package.json > $tmp
    jq ".version = \"$1\"" < $tmp > package.json
}

function posthook {
    git add package.json
    git commit -m "New $2 release version $1"
    git checkout -b release/$1
    git push -u origin release/$1

    git tag $1
    git push origin $1

    python -m webbrowser "https://github.com/cionkubes/cion-web/compare/master...release/$1?expand=1"
    python -m webbrowser "https://github.com/cionkubes/cion-web/compare/develop...release/$1?expand=1"
}

function rollback {
    git reset --hard origin/develop
}