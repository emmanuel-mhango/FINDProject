
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonLink
}) => {
  return (
    <Card className="service-card border shadow-sm overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-find-red mb-4 text-4xl">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center p-6 pt-0">
        <Button className="action-button w-full" asChild>
          <Link to={buttonLink}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
