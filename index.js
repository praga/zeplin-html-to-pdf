process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;

const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");

exports.handler = function handler(event, context, callback) {
    if (!event.html_base64) {
        const errorResponse = errorUtil.createErrorResponse(400, "Validation error: Missing field 'html_base64'.");

        callback(errorResponse);
        return;
    }
	
	var html_utf8 = new Buffer(event.html_base64, 'base64').toString('utf8');

    wkhtmltopdf(html_utf8, event.options)
        .then(buffer => {
            callback(null, {
                data: buffer.toString("base64")
            });
        }).catch(error => {
            callback(errorUtil.createErrorResponse(500, "Internal server error", error));
        });
};