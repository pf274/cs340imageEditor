
function main(): void {
  console.log(process.argv);
  const sourceImage: string = process.argv[2];
  const keyImage: string = process.argv[3];
  const commandType: string = process.argv[4];
  console.log('Hello, world!');
}

main();