using Microsoft.AspNetCore.Mvc;
using System.Text;
using Util.Ui.Razor;

namespace Util.Angular.Controllers {
    /// <summary>
    /// 查找全部Razor页面生成Html
    /// </summary>
    [Route( "api/html" )]
    [ApiController]
    public class GenerateHtmlController : ControllerBase {
        /// <summary>
        /// 生成Html页面
        /// </summary>
        [HttpGet]
        public async Task<string> GenerateAsync() {
            var message = new StringBuilder();
            var result = await HtmlGenerator.GenerateAsync();
            message.AppendLine( "===================== 开始生成以下Razor页面的html文件 =====================" );
            message.AppendLine();
            message.AppendLine();
            foreach ( var path in result )
                message.AppendLine( path );
            message.AppendLine();
            message.AppendLine();
            message.Append( "============================ html文件生成完成 ============================" );
            return message.ToString();
        }
    }
}
