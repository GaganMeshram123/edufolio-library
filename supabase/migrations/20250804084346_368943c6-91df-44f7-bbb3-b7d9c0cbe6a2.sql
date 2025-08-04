-- Insert sample universities
INSERT INTO public.universities (name, description, location, website) VALUES
('Delhi University', 'University of Delhi is a premier university of India with a venerable legacy and international acclaim for highest academic standards, diverse educational programmes, distinguished faculty, illustrious alumni, varied co-curricular activities and modern infrastructure.', 'Delhi, India', 'https://www.du.ac.in/'),
('Mumbai University', 'The University of Mumbai is one of the oldest and premier Universities in India. It was established in 1857 consequent upon "Wood''s Education Dispatch", and it is one of the first three Universities in India.', 'Mumbai, India', 'https://mu.ac.in/'),
('Bangalore University', 'Bangalore University is a public state university located in Bangalore, Karnataka, India. It was established in 1964 and offers undergraduate and postgraduate courses in various disciplines.', 'Bangalore, India', 'https://bangaloreuniversity.ac.in/'),
('Pune University', 'Savitribai Phule Pune University, formerly University of Pune, is a collegiate public state university located in Pune, Maharashtra, India. It was established in 1949.', 'Pune, India', 'https://www.unipune.ac.in/');

-- Insert sample branches for each university
WITH university_ids AS (
  SELECT id, name FROM public.universities
)
INSERT INTO public.branches (name, description, university_id) 
SELECT branch_name, branch_desc, uni.id
FROM university_ids uni
CROSS JOIN (
  VALUES 
    ('Computer Science Engineering', 'Computer Science Engineering deals with design, implementation, and management of information systems of both software and hardware processes.'),
    ('Information Technology', 'Information Technology is a branch of engineering dealing with the use of computers and telecommunications to retrieve, store and transmit information.'),
    ('Electronics and Communication Engineering', 'Electronics and Communication Engineering deals with the electronic devices, circuits, communication equipments like transmitter, receiver, integrated circuits.'),
    ('Mechanical Engineering', 'Mechanical Engineering is the branch of engineering dealing with the design, construction, and use of machines.'),
    ('Civil Engineering', 'Civil Engineering is the oldest branch of engineering that deals with the design, construction, and maintenance of the physical and naturally built environment.'),
    ('Electrical Engineering', 'Electrical Engineering deals with the study and application of electricity, electronics, and electromagnetism.'),
    ('Chemical Engineering', 'Chemical Engineering is the branch of engineering that deals with chemical production and the manufacture of products through chemical processes.'),
    ('Biotechnology', 'Biotechnology is the use of living systems and organisms to develop or make products, or any technological application that uses biological systems.'),
    ('Aerospace Engineering', 'Aerospace Engineering is the primary field of engineering concerned with the development of aircraft and spacecraft.'),
    ('Automobile Engineering', 'Automobile Engineering is the branch of engineering which deals with designing, manufacturing and operating automobiles.')
) AS branches(branch_name, branch_desc);