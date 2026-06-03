using CatalogService.Domain.Common;

namespace CatalogService.Domain.Entities;

public sealed class Category : BaseEntity
{
    private readonly List<Product> _products = new();

    private Category() { }

    public Category(
        string name,
        string slug,
        string? description = null,
        Guid? parentId = null)
    {
        Name = name;
        Slug = slug;
        Description = description;
        ParentId = parentId;
        IsActive = true;
    }

    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public Guid? ParentId { get; private set; }
    public bool IsActive { get; private set; }

    public Category? Parent { get; private set; }
    public IReadOnlyCollection<Product> Products => _products;

    public void Update(
        string name,
        string slug,
        string? description,
        Guid? parentId,
        bool isActive)
    {
        Name = name;
        Slug = slug;
        Description = description;
        ParentId = parentId;
        IsActive = isActive;
    }

    public void Activate() => IsActive = true;

    public void Deactivate() => IsActive = false;
}