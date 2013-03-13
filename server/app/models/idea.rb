class Idea
  include DataMapper::Resource
  property :id,       Serial
  property :status, String

  belongs_to :comment, :key => true

  # comment has n related comments if it's an idea
  has n, :comments

  # comment has n criteria status if it's an idea
  has n, :criteria_statuses

end
