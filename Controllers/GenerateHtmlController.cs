using Microsoft.AspNetCore.Mvc;
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
            await HtmlGenerator.GenerateAsync();
            return "ok";
        }
    }
}
