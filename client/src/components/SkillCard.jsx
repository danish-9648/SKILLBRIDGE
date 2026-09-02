import {
    Code2,
    Database,
    GitBranch,
    BrainCircuit,
    MessageCircle,
    Users
} from "lucide-react";

const iconMap = {
    JavaScript: Code2,
    React: BrainCircuit,
    "Node.js": Code2,
    MongoDB: Database,
    Git: GitBranch,
    Communication: MessageCircle,
    Teamwork: Users
};

function SkillCard({
    name,
    score,
    level,
    category
}) {

    const Icon =
        iconMap[name] || Code2;

    return (
        <div className="skill-card">

            <div className="skill-card-top">

                <div className="skill-icon">
                    <Icon size={20} />
                </div>

                <div className="skill-info">

                    <strong>
                        {name}
                    </strong>

                    <span>
                        {category}
                    </span>

                </div>

                <div className="skill-score">
                    {score}%
                </div>

            </div>

            <div className="progress-track">

                <div
                    className="progress-fill"
                    style={{
                        width: `${score}%`
                    }}
                />

            </div>

            <div className="skill-card-bottom">

                <span>
                    {level}
                </span>

                <span>
                    Skill proficiency
                </span>

            </div>

        </div>
    );
}

export default SkillCard;