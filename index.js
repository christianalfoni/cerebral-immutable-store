var Store = require('immutable-store');

var getValue = function (path, obj) {
  path = path.slice();
  while (path.length) {
    obj = obj[path.shift()];
  }
  return obj;
};

module.exports = function (state) {

  return function (controller) {

    var initialState = Store(state);
    state = initialState;

    controller.on('reset', function () {
      state = initialState;
    });

    controller.on('seek', function (seek, isPlaying, recording) {
      state = state.import(recording.initialState);
    });

    return {
        get: function (path) {
          return getValue(path, state);
        },
        toJSON: function () {
          return state.toJS();
        },
        getRecordingState: function () {
          return state.export();
        },
        mutators: {
          set: function (path, value) {
            var key = path.pop();
            state = getValue(path, state).set(key, value);
          },
          unset: function (path) {
            var key = path.pop();
            state = getValue(path, state).unset(key);
          },
          push: function (path, value) {
            state = getValue(path, state).push(value);
          },
          splice: function () {
            var args = [].slice.call(arguments);
            var value = getValue(args.shift(), state);
            state = value.splice.apply(value, args);
          },
          merge: function (path, value) {
            state = getValue(path, state).merge(value);
          },
          concat: function () {
            var args = [].slice.call(arguments);
            var value = getValue(args.shift(), state);
            state = value.concat.apply(value, args);
          },
          pop: function (path) {
            state = getValue(path, state).pop();
          },
          shift: function (path) {
            state = getValue(path, state).shift();
          },
          unshift: function (path, value) {
            state = getValue(path, state).unshift(value);
          }
        }
    };

  };

};
