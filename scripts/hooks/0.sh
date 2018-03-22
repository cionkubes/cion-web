function get_version {
    jq '.version' --raw-output < package.json
}

function prehook {
    [[ $(git rev-parse --abbrev-ref --symbolic-full-name @{u}) == "origin/master" ]] || err "Branch does not track origin/master"
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
    git tag $1
    git push origin $1
    git checkout -b release/$1
    git push --set-upstream
}