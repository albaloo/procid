class Network
  include DataMapper::Resource
  property :id,           Serial
  belongs_to :participant
  belongs_to :issue
 
end
