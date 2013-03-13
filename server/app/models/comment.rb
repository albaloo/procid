class Comment
  include DataMapper::Resource

  # define our schema
  property :id,   Serial
  property :title, String,  :required => true
  property :link, String, :default => false, :required => true
  property :content, String

  belongs_to :participant, :key => true

  # comment may belong to an idea
  belongs_to :ideasource, 'Idea', :required => false

  # comment may have 1 idea properties if it's an idea
  has 1, :idea, :required => false

  # comment may have n tags
  has n, :tag, :required => false

end
