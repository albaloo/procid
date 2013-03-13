class Issue
  include DataMapper::Resource
  property :id,           Serial
  property :title,        String,   :required => true
  has n, :comments
  has n, :criterias

end

