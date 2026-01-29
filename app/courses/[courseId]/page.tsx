'use client';
import Button from "@/components/ui/Button";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

async function getCourseDetails(courseId: string) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`);
        if (!response) {
            return null;
        }
        else if (response.status === 400 || response.status === 404) {
            return "Course not found";
        }
        return response.data;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

export default function ShowCourseDetails() {
    const params = useParams();
    const courseId = params.courseId as string;
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            const result = await getCourseDetails(courseId);
            setCourse(result);
            setLoading(false);
        };
        fetchCourse();
    }, [courseId]);

    const handleEnrollment = async () => {
        try {
            const response = await axios.post('/api/enrollments/enroll', {
                courseId: courseId
            });
            
            if (response) {
                alert("enrolled in course");
            }
        } catch (error: any) {
            console.error("Enrollment failed:", error);
            alert("Enrollment failed");
        }
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return (
            <div className="w-full flex justify-center" style={{marginTop: "150px"}}>
                <div className="max-w-md p-6">
                    <h1 className="text-3xl font-bold text-red-600">
                        Course not found
                    </h1>
                </div>
            </div>
        );
    }

    function getPlaceholderImage(title: string) {
        const encodedTitle = encodeURIComponent(title);
        return `https://placehold.co/400x220?text=${encodedTitle}`;
    }

    return (
        <div className="w-full flex justify-center bg-amber-50" style={{marginTop: "80px", marginBottom: "0px", paddingTop:"30px", paddingBottom:"50px"}}>
            <div className="child-div m-[20px] max-w-full flex-column rounded-2xl bg-amber-100" style={{padding:"20px"}}>
                <Image
                    src={getPlaceholderImage(course.title)}
                    alt={course.title}
                    width={400}
                    height={220}
                    className="course-img"
                    unoptimized
                />
                <div className="max-w-[365px] p-6 ali text-center" style={{margin : "20px"}}>
                    <h1 className="text-3xl font-bold">
                        {course.title}
                    </h1>
                    <p className="max-w-[365px]" style={{marginTop : "20px"}}>
                        {course.description}
                    </p>
                    <h5 className="text-2xl font-bold">Price: $ {course.price}</h5>
                    <h6 className="font-bold">Instructor : <Link href={`/instructor/${course.instructor.id}`} className="text-amber-800 underline">{course.instructor.name}</Link></h6>
                    <Button type="button" variant="primary" onClick={handleEnrollment} style={{marginTop: "20px", width:"350px"}}>Enroll Now</Button>
                </div>
            </div>
        </div>
    );
}