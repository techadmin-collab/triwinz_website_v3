export default function sitemap() {
  const baseUrl = "https://triwinz.com";
  const lastModified = new Date().toISOString().split("T")[0];

 return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/egovernance-visa-platform-solutions/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/evisa-suite/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/it-digital-transformation/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sap-consulting-support-services/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/triwinz-cloudkart/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/custom-software-erp-development/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}