using System.ComponentModel;
using Util.Data.Queries;

namespace Util.Angular.Models {
    /// <summary>
    /// 声明查询参数
    /// </summary>
    public class ClaimQuery : QueryParameter {
        /// <summary>
        /// 声明标识
        ///</summary>
        [Description( "声明标识" )]
        public Guid? ClaimId { get; set; }
        /// <summary>
        /// 声明名称
        ///</summary>
        [Description( "声明名称" )]
        public string Name { get; set; }
        /// <summary>
        /// 启用
        ///</summary>
        [Description( "启用" )]
        public bool? Enabled { get; set; }
        /// <summary>
        /// 备注
        ///</summary>
        [Description( "备注" )]
        public string Remark { get; set; }
    }
}