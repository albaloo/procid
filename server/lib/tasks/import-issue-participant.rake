#lib/tasks/import-issue-participant.rake
desc "Prepopulate the Issue and Participant table"
task :csv_network_import => :environment do 
  lines = File.new("relations.txt").readlines
  lines.each do |line|
	values = line.strip.split("\t")
	username = values[0]
	participant = Participant.first_or_create({:user_name =>username})			 
	values.shift
	values.each do |value|		
		value = "/node/" + value
		issue = Issue.first({:link => value})
		Network.first_or_create({:participant => participant, :issue => issue})	 
	end
  end

end
