class Comment
  include DataMapper::Resource

  # define our schema
  property :id,   Serial
  property :title, String, :required => true
  property :link, String,:length=>500, :required => true
  property :content,String,:length=>60000
  property :tone,String

  belongs_to :participant

  # comment may belong to an idea
  belongs_to :ideasource, 'Idea', :required => false

  # comment may have 1 idea properties if it's an idea
  has 1, :idea, :required => false

  # comment may have n tags
  has n, :tags

  belongs_to :issue,:required=>false
  belongs_to :idea,:required=>false
  belongs_to :criteria_status, :required=>false
end
