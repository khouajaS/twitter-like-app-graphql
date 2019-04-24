function withState(fun, argsTranform) {
  const that = this;
  return function runner(args) {
    console.log(that);
    const ar = argsTranform(args, that);
    return fun.apply(null, ...ar);
  };
}

class hasContext {
  constructor(props) {
    this.props = props;
    this.plugins = [];
  }

  addPlugin(plugin) {
    this.plugins.push({ name: plugin.name, runner: plugin.runner.bind(this) });
  }

  runPlugin(name) {
    const pl = this.plugins.find((plug) => plug.name === name);
    if (!pl) throw new Error(`${name} plugin not found !`);
    return (...args) => pl.runner(...args);
  }
}

test('should run with context', () => {
  const stateful = new hasContext({ age: 20 });
  function setAge(plus) {
    return this.props.age + plus;
  }
  stateful.addPlugin({ name: 'setAge', runner: setAge });

  expect(stateful.runPlugin('setAge')(11)).toEqual(31);
});

// test('should run with withState', () => {
//   const stateful = new hasContext({ age: 20 });

//   function setAgePure(age, plus) {
//     return age + plus;
//   }
//   stateful.addPlugin({
//     name: 'setAge',
//     runner: withState(setAgePure, (plus, that) => [that.props.age, plus])
//   });

//   expect(stateful.runPlugin('setAge')(11)).toEqual(31);
// });
