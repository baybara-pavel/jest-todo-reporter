const jestUtils = require('jest-util');
const StdIo = require('./StdIo');

class ToDoReporter {
  constructor() {
    this.stdio = new StdIo();
    this.todo = {};
    this.todoCount = 0;
  }

  onRunStart(aggregatedResults, options) {
    if (jestUtils.isInteractive) {
      jestUtils.clearLine(process.stderr);
    }
  }

  onRunComplete() {
    if (this.todoCount > 0) {
      const suites = Object.keys(this.todo);
      this.stdio.log(
        `TODO ${this.todoCount} specs in ${suites.length} suites`
      );
      suites.forEach(path => {
        const todoTestNames = this.todo[path];
        this.stdio.log(`  todo ${todoTestNames.length} specs in ${path}`);
        todoTestNames.forEach(name => {
          this.stdio.log(`    - ${name}`);
        });
      });
    }
    this.stdio.close();
  }

  onTestResult(test, testResult) {
    if (testResult.numTodoTests > 0) {
      this.todo[testResult.testFilePath] = testResult.testResults.reduce(
        (todo, result) => {
          if (result.status === 'todo') {
            this.todoCount += 1;
            todo.push(result.fullName);
          }
          return todo;
        },
        []
      );
    }
  }
}

module.exports = ToDoReporter;
