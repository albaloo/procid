class Issue
  include DataMapper::Resource
  property :id,           Serial
  property :title,        String,:length=>1000
  property :status,	String
  property :link, 	String,:length=>500,   :required => true
  
  belongs_to :participant
  has n, :comments, :required => false
  has n, :criterias, :required => false

end

