class CriteriaStatus
  include DataMapper::Resource
  property :id,           Serial
  property :score,        Integer,   :default => 0
  belongs_to :criteria, :key => true
  belongs_to :idea, :key => true
  has 1, :comment
end
