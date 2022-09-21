using System.ComponentModel.DataAnnotations;

namespace Util.Angular.Models {
    /// <summary>
    /// 应用程序参数
    /// </summary>
    public class ApplicationDto {
        /// <summary>
        /// 应用程序编码
        ///</summary>
        [Display( Name = "应用程序编码" )]
        [Required]
        [MaxLength( 6 )]
        [MinLength( 2 )]
        public string Code { get; set; }
        /// <summary>
        /// 应用程序名称
        ///</summary>
        [Display( Name = "应用程序名称" )]
        [Required( ErrorMessage = "应用程序名称不能为空" )]
        [MaxLength( 200 )]
        public string Name { get; set; }
        /// <summary>
        /// 应用程序类型
        ///</summary>
        [Display( Name = "应用程序类型" )]
        public ApplicationType? Type { get; set; }
        /// <summary>
        /// 启用
        ///</summary>
        [Display( Name = "启用" )]
        public bool Enabled { get; set; }
        /// <summary>
        /// 备注
        ///</summary>
        [Display( Name = "备注" )]
        [MaxLength( 500 )]
        public string Remark { get; set; }
        /// <summary>
        /// 创建时间
        ///</summary>
        [Display( Name = "创建时间" )]
        public DateTime? CreationTime { get; set; }
        /// <summary>
        /// 创建人标识
        ///</summary>
        [Display( Name = "创建人标识" )]
        public Guid? CreatorId { get; set; }
        /// <summary>
        /// 最后修改时间
        ///</summary>
        [Display( Name = "最后修改时间" )]
        public DateTime? LastModificationTime { get; set; }
        /// <summary>
        /// 最后修改人标识
        ///</summary>
        [Display( Name = "最后修改人标识" )]
        public Guid? LastModifierId { get; set; }
        /// <summary>
        /// 版本号
        ///</summary>
        [Display( Name = "版本号" )]
        public byte[] Version { get; set; }
    }
}