// vue.config.js
module.exports = {
    devServer: {
		    proxy: {
		      '/api': {
		        target: 'http://182.92.76.31:8800',
				changeOrigin: true,
		        pathRewrite: {
		          '^/api': ''
		        }
		      }
		    },
	}
} 