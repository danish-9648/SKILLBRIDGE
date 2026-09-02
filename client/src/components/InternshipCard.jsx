import {
    MapPin,
    Clock3,
    IndianRupee,
    Users,
    ArrowRight,
    CheckCircle2
} from "lucide-react";

import {
    applyForInternship
} from "../services/api";


function InternshipCard({

    id,

    title,

    company,

    location,

    duration,

    score,

    skills = [],

    openings,

    stipend,

    workMode,

    internshipType,

    alreadyApplied = false,

    onApplicationSuccess

}) {


    // ========================================
    // APPLY
    // ========================================

    const handleApply = async () => {

        try {

            if (!id) {

                alert(
                    "Internship ID is missing."
                );

                console.error(
                    "Missing internship ID"
                );

                return;
            }


            console.log(
                "Applying for internship:",
                id
            );


            const response =
                await applyForInternship(id);


            console.log(
                "Application response:",
                response
            );


            alert(
                response.message ||
                "Application submitted successfully!"
            );


            // Refresh application state

            if (
                onApplicationSuccess
            ) {

                await onApplicationSuccess();

            }


        } catch (error) {

            console.error(
                "Application Error:",
                error
            );


            // ========================================
            // ALREADY APPLIED
            // ========================================

            if (
                error.message ===
                "You have already applied for this internship"
            ) {

                alert(
                    "You have already applied for this internship."
                );

                return;
            }


            alert(
                error.message ||
                "Unable to apply for internship."
            );

        }

    };


    return (

        <div className="internship-card">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="internship-card-header">

                <div>

                    <span className="panel-label">

                        {internshipType ||
                            "INTERNSHIP"}

                    </span>


                    <h3>
                        {title}
                    </h3>


                    <p>
                        {company ||
                            "Industry Partner"}
                    </p>

                </div>


                <div className="match-score">

                    <strong>
                        {score ?? 0}%
                    </strong>

                    <span>
                        Match
                    </span>

                </div>

            </div>


            {/* ========================================
                INFORMATION
            ======================================== */}

            <div className="internship-info">

                <span>

                    <MapPin size={16} />

                    {location ||
                        "Remote"}

                </span>


                <span>

                    <Clock3 size={16} />

                    {duration ||
                        "3 Months"}

                </span>


                <span>

                    <IndianRupee size={16} />

                    ₹{stipend || 0}/month

                </span>


                <span>

                    {workMode ||
                        "HYBRID"}

                </span>

            </div>


            {/* ========================================
                SKILLS
            ======================================== */}

            <div className="internship-skills">

                {skills.map(
                    (skill, index) => (

                        <span
                            key={`${skill}-${index}`}
                        >
                            {skill}
                        </span>

                    )
                )}

            </div>


            {/* ========================================
                FOOTER
            ======================================== */}

            <div className="internship-card-footer">


                <div className="opening-info">

                    <Users size={16} />

                    <span>
                        {openings || 1}
                        {" "}openings
                    </span>

                </div>


                {/* ========================================
                    ALREADY APPLIED
                ======================================== */}

                {alreadyApplied ? (

                    <button
                        type="button"
                        className="secondary-button"
                        disabled
                    >

                        <CheckCircle2
                            size={16}
                        />

                        Already Applied

                    </button>

                ) : (

                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleApply}
                    >

                        Apply Now

                        <ArrowRight
                            size={16}
                        />

                    </button>

                )}

            </div>

        </div>

    );

}


export default InternshipCard;