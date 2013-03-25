#lib/tasks/import-participant.rake
desc "Prepopulate the Participant table"
task :csv_participant_import => :environment do 
  lines = File.new("attributes-participant.txt").readlines
  lines.each do |line|
	values = line.strip.split("\t")
	lastName = ""
	firstName = ""
	if values.length > 4
		lastName = values[4]
	end 
	if values.length > 3
		firstName = values[3]
	end
	part = Participant.first_or_create({:user_name =>values[0]},{:link=>values[1], :experience=>values[2], :first_name=>firstName, :last_name=>lastName})			 
	puts values[0]
  end

end
