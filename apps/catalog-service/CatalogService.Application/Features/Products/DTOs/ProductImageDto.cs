using System;
using System.Collections.Generic;
using System.Text;

namespace CatalogService.Application.Features.Products.DTOs
{

    public sealed record ProductImageDto(
        Guid Id,
        string Url,
        int SortOrder,
        bool IsPrimary);
}
