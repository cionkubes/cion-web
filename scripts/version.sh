#!/usr/bin/env sh

function err {
    echo $@
    return 1
}

function run_bump {
    IFS="." read MAJOR MINOR PATCH <<< $(get_version)
    case "$1" in
        "major" | "breaking" ) get_major $MAJOR;;
        "minor" | "feature" ) get_minor $MAJOR $MINOR;;
        "patch" | "fix" ) get_patch $MAJOR $MINOR $PATCH;;
    esac

    (set -e; run_if_fn prehook $NEW_VER $1)
    if [ $? -ne 0 ]; then
        echo Prehook rejected version $NEW_VER
        exit 1
    fi

    (set -e; write_version $NEW_VER $1)
    if [ $? -ne 0 ]; then
        echo Write version failed
        (set -e; run_if_fn rollback "$MAJOR.$MINOR.$PATCH")
        exit 1
    fi

    (set -e; run_if_fn posthook $NEW_VER $1)
    if [ $? -ne 0 ]; then
        echo Posthook failed
        (set -e; run_if_fn rollback "$MAJOR.$MINOR.$PATCH")
        exit 1
    fi
}

function run_if_fn {
    if [[ $(type -t $1) = "function" ]]; then
        $@
    fi
} 

function get_major {
    NEW_VER="$(($1 + 1)).0.0"
}

function get_minor {
    NEW_VER="$1.$(($2 + 1)).0"
}

function get_patch {
    NEW_VER="$1.$2.$(($3 + 1))"
}

HOOKS=$(dirname $0)/hooks

for file in $HOOKS/*; do
    source $file
done

case "$1" in 
    "get" ) get_version;;
    "bump" ) run_bump $2;;
    * ) echo "Command must be one of (get, bump)" && exit 1;;
esac