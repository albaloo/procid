class Criteria
  include DataMapper::Resource
  property :id,           Serial
  property :title,        String
  property :description,        String
  belongs_to :issue, :key => true
  belongs_to :participant
  has n, :criteria_statuses

  def assignment_name
    assignment.assignment_name if assignment
  end
 
  def max_points
    assignment.max_points if assignment
  end

end
