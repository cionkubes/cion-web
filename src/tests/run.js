import Jasmine from 'jasmine'

const jasmine = new Jasmine();

jasmine.loadConfig({
    "spec_dir": "src/web/tests",
    "spec_files": [
        "**/*.js"
    ],
    "stopSpecOnExpectationFailure": false,
    "random": false
});

jasmine.execute()