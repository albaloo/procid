class Participant
  include DataMapper::Resource
  property :id,           Serial
  property :user_name,    String,   :required => true
  property :link,    String,   :required => false
  property :last_name,    String,   :required => false
  property :first_name,   String,   :required => false
  property :experience,   Integer,   :required => false
  
  has n, :comments
  has n, :criterias, :required =>false

end
