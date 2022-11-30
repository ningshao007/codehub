const errorTypes = require('../constants/error-types');
const service = require('../service/user.service');
const md5password = require('../utils/password-handle');

const verifyUser = async (ctx, next) => {
	// 1.获取用户名和密码
	const { name, password } = ctx.request.body;

	// 2.判断用户名或者密码不能空
	if (!name || !password) {
		const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
		return ctx.app.emit('error', error, ctx);
	}

	// 3.判断这次注册的用户名是没有被注册过
	const result = await service.getUserByName(name);

	if (result.length) {
		const error = new Error(errorTypes.USER_ALREADY_EXISTS);
		// 抛出错误(app.on('error',errorHandler)里执行),不往下执行
		return ctx.app.emit('error', error, ctx);
	}

	// 调用下一个中间件,否则userRouter.post('/',verifyUse,handlePassword,create)不往下一个中间件执行
	await next();
};

const handlePassword = async (ctx, next) => {
	const { password } = ctx.request.body;
	ctx.request.body.password = md5password(password);

	await next();
};

module.exports = {
	verifyUser,
	handlePassword,
};
