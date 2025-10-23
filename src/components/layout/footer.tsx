export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          &copy; {new Date().getFullYear()} Domain Insights. All rights reserved. <br/>
          Disclaimer: The information provided is for informational purposes only and does not constitute legal or financial advice.
        </p>
      </div>
    </footer>
  );
}
