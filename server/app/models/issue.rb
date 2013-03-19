class Issue
  include DataMapper::Resource
  property :id,           Serial
  property :title,        String,   :required => true
  has n, :comments, :required => false
  has n, :criterias

end

