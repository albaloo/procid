class CriteriaStatus
  include DataMapper::Resource
  property :id,           Serial
  property :score,        Integer,   :default => 0
  belongs_to :criteria
  belongs_to :idea
  has 1, :comment, :required => false
end
