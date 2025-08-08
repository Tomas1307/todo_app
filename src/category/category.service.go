package category

type ICategoryService interface {
	CreateCategory(dto CreateCategoryDTO) (Category, error)
	GetAllCategories() ([]Category, error)
	DeleteCategory(id uint) error
}

type categoryService struct {
	repository ICategoryRepository
}

func NewCategoryService(repo ICategoryRepository) ICategoryService {
	return &categoryService{
		repository: repo,
	}
}

func (s *categoryService) CreateCategory(dto CreateCategoryDTO) (Category, error) {
	newCategory := Category{
		Name:        dto.Name,
		Description: dto.Description,
	}
	return s.repository.Create(newCategory)
}

func (s *categoryService) GetAllCategories() ([]Category, error) {
	return s.repository.FindAll()
}

func (s *categoryService) DeleteCategory(id uint) error {
	return s.repository.Delete(id)
}
