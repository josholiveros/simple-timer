// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { data } = context;

    if (_.isEmpty(data.title)) {
      throw new Error('A task must at least have a title');
    }

    context.data = {
      userId: _.get(context, 'params.user._id'),
      title: _.get(data, 'title'),
      goal: _.get(data, 'goal'),
      spent: _.get(data, 'spent'),
      startTime: _.get(data, 'startTime'),
      status: _.get(data, 'status')
    };

    return context;
  };
};
