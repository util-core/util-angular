using System.ComponentModel.DataAnnotations;

namespace Util.Angular.Models {
    /// <summary>
    /// 声明参数
    /// </summary>
    public class ClaimDto {
        /// <summary>
        /// 声明名称
        ///</summary>
        [Display( Name = "声明名称" )]
        [Required]
        [MaxLength( 200 )]
        public string Name { get; set; }
        /// <summary>
        /// 启用
        ///</summary>
        [Display( Name = "启用" )]
        public bool Enabled { get; set; }
        /// <summary>
        /// 排序号
        ///</summary>
        [Display( Name = "排序号" )]
        [Required]
        [Range(2,10)]
        public int? SortId { get; set; }
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