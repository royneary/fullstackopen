const Header = (props) => <h1>{props.course}</h1>;

const Part = ({ part: { name, exercises } }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part part={part} key={part.id} />
    ))}
  </div>
);

const Total = ({ total }) => (
  <p>
    <b>Total of {total} exercises</b>
  </p>
);

const Course = ({ course: { name, parts } }) => {
  const total = parts.reduce((acc, p) => acc + p.exercises, 0);
  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
      <Total total={total} />
    </div>
  );
};

export default Course;
